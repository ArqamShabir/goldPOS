import { useState } from "react";
import styles from '../css/InnerDashboard.module.css'

export default function InnerDashboard() {
    
    const dummySales = [
        {
          id: '01015',
          datetime: '2022-05-17 22:00',
          type: 'Rings',
          customer: 'Masud Rana',
          status: 'Complete',
          amount: 250,
        },
        {
          id: '01016',
          datetime: '2022-06-01 20:30',
          type: 'Chains',
          customer: 'Masud Rana',
          status: 'Pending',
          amount: 180,
        },
        {
          id: '01017',
          datetime: '2022-06-21 15:15',
          type: 'Set',
          customer: 'Masud Rana',
          status: 'Complete',
          amount: 300,
        },
      ];

      const [sales, setSales] = useState(dummySales);

    const filters = ['All', 'Monthly', 'Weekly', 'Today'];
    const [currentFilter, setCurrentFilter] = useState('All');

    const handleFilter = (filter)=>{
      setCurrentFilter(filter)
    }


  return (
    <>
        <div className={styles.container} >

            <div className={styles.header}>
                <h2 className={styles.title} >Recent Sales</h2>
                <div className={styles.filters} >
                  {filters.map((item,_)=>(
                    <button key={item}  
                    className={`${styles.filterButton} ${currentFilter===item ? styles.active : ''}`} 
                    onClick={()=>(handleFilter(item))}
                    >
                      {item}
                    </button>
                  ))}

                </div>
            </div>

            <div className={styles.tableContainer} >
                <table className={styles.table} >
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date/Time</th>
                            <th>Type</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                          sales.map((item,_)=>(
                            <tr key={item.id}>
                               <td>{item.id}</td>
                              <td>{item.datetime}</td>
                              <td>{item.type}</td>
                              <td>{item.customer}</td>
                              <td><span className={`${styles.status} ${styles[item.status.toLowerCase()]}`} >{item.status}</span></td>
                              <td>{item.amount}</td>

                            </tr>
                          ))
                        }
                    </tbody>
                </table>
            </div>

        </div>
    </>
  )
}
