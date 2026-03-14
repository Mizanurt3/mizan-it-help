import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import InsertTransactionPopup from './InsertTransactionPopup';

// API থেকে লেনদেন তথ্য পেতে ফাংশন
const fetchTransactions = async () => {
  const res = await axios.get('/api/transactions');
  return res.data;
};

export default function DataGrid({ onEditClick }) {
  const queryClient = useQueryClient();

  const [showPopup, setShowPopup] = useState(false); // শীর্ষে ব্যবহার
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // লেনদেন মুছে ফেলার জন্য mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/transactions?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      alert('লেনদেন সফলভাবে মুছে ফেলা হয়েছে!');
    },
    onError: (error) => {
      alert(`ত্রুটি ঘটেছে: ${error.response?.data?.message || error.message}`);
    },
  });

  // লেনদেন মুছে ফেলার জন্য ফাংশন
  const handleDelete = (id) => {
    if (confirm('আপনি কি নিশ্চিত যে আপনি এই লেনদেনটি মুছে ফেলতে চান?')) {
      deleteMutation.mutate(id);
    }
  };

  // Query থেকে লেনদেন ডাটা লোড করা
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  if (isLoading) return <p>লোড হচ্ছে...</p>;
  if (error) return <p>ত্রুটি: {error.message}</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // UTC থেকে Local Time
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(localDate);
  };

  // const formatDate = (dateString) => {
  //   const options = { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  //   return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  // };
  

  const totalDeposit = data.result.reduce((acc, item) => acc + (item.deposit_amount || 0), 0);
  const totalWithdraw = data.result.reduce((acc, item) => acc + (item.withdraw_amount || 0), 0);
  const balance = totalDeposit - totalWithdraw;

  return (
    <div>
      {showPopup && <InsertTransactionPopup onClose={togglePopup} />}
      <div className={`${styles.summary} flex flex-row items-center gap-4`}>
        
        <p className="p-2 border rounded-md">মোট জমা: {totalDeposit}</p>
        <p className="p-2 border rounded-md">মোট খরচ: {totalWithdraw}</p>
        <p className="p-2 border rounded-md">বর্তমান ব্যালেন্স: {balance}</p>

        <button
          onClick={togglePopup}
          className="bg-amber-400 p-4 rounded-lg shadow-lg flex flex-col gap-4"
        >
          লেনদেন যুক্ত করুন
        </button>
      </div>

      
      <table className={styles.table}>
        <thead>
          <tr>
            <th className="max-w-[37px]">জমা/খরচ</th> 
            <th className="min-w-[75px]">লেনদেনের-তারিখ</th>
            <th>বিবরণ</th>
            <th className="max-w-[42px]">জমার <br /> টাকা</th>
            <th className="max-w-[42px]">খরচের <br /> টাকা</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.result.map((item) => (
            <tr key={item.id}>
              <td className="max-w-[37px]">{item.transaction_type}</td>
              <td>{formatDate(item.transaction_date)}</td>
              <td>{item.description}</td>
              <td>{item.deposit_amount}</td>
              <td>{item.withdraw_amount}</td>
              <td>
                <button onClick={() => onEditClick(item)}>✏️</button>
              </td>
              <td>
                <button onClick={() => handleDelete(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
