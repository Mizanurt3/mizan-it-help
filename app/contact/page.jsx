import React from "react";
import styles from "@/app/contact/styles/Contact.module.css"; // CSS Module ইমপোর্ট

export default function Contact() {
  return (
    <div className={styles.main}>
      <h1>
        Mazadanga IT <span>Point</span>
        <br />
      
        In<span>for</span>mation
      </h1>

      <table>
        <thead>
          <tr>
            <th>Shop Name:</th>
            <td>Mazadanga IT Point</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Propritor:</th>
            <td>Mizanur Rahman</td>
          </tr>
          <tr>
            <th>Contact:</th>
            <td>
              <a href="tel://01742734391"><span>01742734391</span> </a>
            </td>
          </tr>
          <tr>
            <th>Gmail:</th>
            <td>
              <a href="mailto:mizanurt3@gmail.com"><span>mizanurt3@gmail.com</span> </a>
            </td>
          </tr>
          <tr>
            <th>Location:</th>
            <td>Mazadanga, Nilphamari</td>
          </tr>
          <tr>
            <th>Website:</th>
            <td>
              <a href="http://uniqecreator.ezyro.com/"><span>Unique Creator</span> </a>
            </td>
          </tr>
          <tr>
            <th>Youtube:</th>
            <td>
              <a href="https://www.youtube.com/channel/UCKImKFK-TwpgLpfKn291yPQ">
                <span>Tech Unlimited BD</span> 
              </a>
            </td>
          </tr>
          <tr>
            <th>Facebook:</th>
            <td>
              <a href="http://www.facebook.com/mizanurrahman109504">
                <span>Mizanur Rahman</span> 
              </a>
            </td>
          </tr>
          <tr>
            <th>Whatsapp:</th>
            <td>
              <a href="https://wa.me/+8801742734391"><span>01742-734391</span> </a>
            </td>
          </tr>
          <tr>
            <th>Our Services:</th>
            <td>Computer Services & Parts, Digital Multimedia</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
