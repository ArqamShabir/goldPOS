import { useState, useEffect } from "react";
import styles from "../css/Form.module.css"; 
import StockForm from "../components/StockForm";
import OrderForm from "../components/OrderForm";

const Form = () => {

  const [formType, setFormType] = useState("Stock");
  const [date, setDate] = useState('');
 
  return (
    <div className={styles.formContainer}>

        <div className={styles.formRow}>

            <div className={styles.stockLabel}>Stock# 2314</div>

              <div  className={styles.radioContainer}>
                
                <input type="radio"  name="formType" value="inStock"checked={formType === "Stock"}  onChange={() => setFormType("Stock")}/>
                <label htmlFor="" className={styles.radioLabel}>Stock</label>
                
                <input type="radio" value="order"  checked={formType === "Order"}  onChange={() => setFormType("Order")} />
                <label htmlFor="">Order</label>
              </div>

              <div className={styles.dateContainer}>
                <input type="date" id="date" className={styles.dateInput} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>



        </div>

      {formType === "Stock" ?  <StockForm /> : <OrderForm /> }


    </div>
  );
};

export default Form;
