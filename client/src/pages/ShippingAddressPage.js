import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../context/Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, cart: { shippingAddress } } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    localStorage.setItem('shippingAddress', JSON.stringify({ fullName, address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Shipping Address</h1>
        <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4"><label className="block mb-1">Full Name</label><input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full p-2 border rounded"/></div>
          <div className="mb-4"><label className="block mb-1">Address</label><input value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 border rounded"/></div>
          <div className="mb-4"><label className="block mb-1">City</label><input value={city} onChange={(e) => setCity(e.target.value)} required className="w-full p-2 border rounded"/></div>
          <div className="mb-4"><label className="block mb-1">Postal Code</label><input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full p-2 border rounded"/></div>
          <div className="mb-4"><label className="block mb-1">Country</label><input value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full p-2 border rounded"/></div>
          <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800">Continue</button>
        </form>
      </div>
    </div>
  );
}