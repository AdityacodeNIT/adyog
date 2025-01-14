import React, { useContext, useState } from "react";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const {
    totalProductPrice,
    removeItemfromCheckout,
    totalCartPrice,
    orderSuccessful,
  } = useContext(UserContext);

  const [paymentData, setPaymentData] = useState({
    amount: Math.ceil(
      (totalProductPrice() || totalCartPrice()) * 0.18 +
        (totalProductPrice() || totalCartPrice())
    ),
  });

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const keyResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getkey`
      );
      const { key } = keyResponse.data;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v2/payments/paid`,
        paymentData
      );
      if (response) {
        orderSuccessful(response.data);
      }
      const { order } = response.data;
      const options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: " ई-Cart Logistics", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: `${
          import.meta.env.VITE_API_URL
        }/api/v2/payments/paymentcallback`,
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          name: "Gaurav Kumar", //your customer's name
          email: "gaurav.kumar@example.com",
          contact: "9000090000", //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razor = new window.Razorpay(options);

      razor.open();
      if (response) {
        removeItemfromCheckout();
      }
    } catch (error) {
      console.log(error, "Issue in login:");
    }
  };

  // Your component return
  return (
    <div className="bg-slate-300 p-4 flex justify-center items-center h-screen">
      <div className="w-full max-w-md mx-auto bg-white  rounded-lg shadow-md overflow-hidden p-4 py-4 md:max-w-2xl">
        <form onSubmit={handleFormSubmit}>
          <div className="text-2xl font-bold bg-white text-center ">
            {" "}
            Amount{" "}
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="amount"
            value={paymentData.amount}
            onChange={handleInputChange}
            required
            className=" mt-3   w-full  rounded-md font-semibold focus:ring-indigo-300 focus:ring-4 text-center"
          />
          {/* Add input for cover image if needed */}
          {/* <input type="file" name="coverImage" onChange={handleFileChange} /> */}
          <button
            type="submit"
            className="w-full max-w-md mx-auto bg-green-300 rounded-lg shadow-lg overflow-hidden md:max-w-2xl p-2"
          >
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
