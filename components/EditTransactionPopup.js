import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function EditTransactionPopup({ transaction, onClose }) {
  const [formData, setFormData] = useState(transaction);
  const [successMessage, setSuccessMessage] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

  const mutation = useMutation({
    mutationFn: (updatedTransaction) => {
      return axios.put("/api/transactions", updatedTransaction);
    },
    onSuccess: (data) => {
      setSuccessMessage("Transaction updated successfully!");  // সফলতার বার্তা
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);  // ২ সেকেন্ড পরে পপ-আপ বন্ধ
    },
    onError: (error) => {
      console.error("Error updating transaction", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="popup">
      <div className="bg-white p-7 rounded-lg">
        <h2>লেনদেন সংশোধন করুন</h2>
        <form
          className="bg-amber-400 p-4 w-full max-w-lg mx-auto rounded-lg shadow-lg flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="p-2 border rounded-md flex-1"
            value={formData.transaction_type}
            readOnly
          />

          <input
            type="date"
            className="p-2 border rounded-md flex-1"
            value={formData.transaction_date.slice(0, 10)}
            onChange={(e) => {
              const datePart = e.target.value;
              const currentDateTime = new Date();
              const formattedDateTime = `${datePart} ` +
                `${String(currentDateTime.getHours()).padStart(2, '0')}:` +
                `${String(currentDateTime.getMinutes()).padStart(2, '0')}:` +
                `${String(currentDateTime.getSeconds()).padStart(2, '0')}.` +
                `${String(currentDateTime.getMilliseconds()).padStart(3, '0')}`;

              setFormData({ ...formData, transaction_date: formattedDateTime });
            }}
          />

          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded-md flex-1"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {formData.transaction_type === 'জমা' && (
            <input
              type="number"
              className="p-2 border rounded-md flex-1"
              placeholder="জমা টাকা"
              value={formData.deposit_amount || ''}
              onChange={(e) =>
                setFormData({ ...formData, deposit_amount: e.target.value })
              }
            />
          )}

          {formData.transaction_type === 'খরচ' && (
            <input
              type="number"
              className="p-2 border rounded-md flex-1"
              placeholder="খরচ টাকা"
              value={formData.withdraw_amount || ''}
              onChange={(e) =>
                setFormData({ ...formData, withdraw_amount: e.target.value })
              }
            />
          )}

          <button type="submit">Update Transaction</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      </div>
    </div>
  );
}
