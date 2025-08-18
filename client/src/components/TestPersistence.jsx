import React, { useContext } from 'react';
import { Store } from '../context/Store';
import { useWishlist } from '../context/WishlistContext';

const TestPersistence = () => {
  const { state, dispatch } = useContext(Store);
  const { userInfo, cart } = state;
  const { wishlistItems, addToWishlist, clearWishlist } = useWishlist();

  const testProduct = {
    _id: '123',
    name: 'Test Product',
    price: 10,
    image: '/images/test.jpg',
    brand: 'Test Brand',
    category: 'Test',
    countInStock: 10
  };

  const addTestItemToCart = () => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...testProduct, qty: 1 }
    });
  };

  const addTestItemToWishlist = () => {
    addToWishlist(testProduct);
  };

  const simulateLogout = () => {
    dispatch({ type: 'USER_LOGOUT' });
  };

  const simulateLogin = () => {
    const testUser = {
      _id: 'testuser123',
      name: 'Test User',
      email: 'test@test.com'
    };
    dispatch({ type: 'USER_LOGIN', payload: testUser });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Cart & Wishlist Persistence Test
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            User Status
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {userInfo ? (
              <div>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  ✓ Logged in as: {userInfo.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ID: {userInfo._id}
                </p>
                <button
                  onClick={simulateLogout}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <p className="text-orange-600 dark:text-orange-400 font-medium">
                  ⚠ Not logged in
                </p>
                <button
                  onClick={simulateLogin}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Sign In (Test User)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cart Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Cart ({cart.cartItems.length} items)
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {cart.cartItems.length > 0 ? (
              <div>
                {cart.cartItems.map((item) => (
                  <div key={item._id} className="text-sm text-gray-600 dark:text-gray-300">
                    {item.name} (Qty: {item.qty})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Cart is empty</p>
            )}
            <button
              onClick={addTestItemToCart}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add Test Item
            </button>
          </div>
        </div>

        {/* Wishlist Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Wishlist ({wishlistItems.length} items)
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {wishlistItems.length > 0 ? (
              <div>
                {wishlistItems.map((item) => (
                  <div key={item._id} className="text-sm text-gray-600 dark:text-gray-300">
                    {item.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Wishlist is empty</p>
            )}
            <button
              onClick={addTestItemToWishlist}
              className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors mr-2"
            >
              Add Test Item
            </button>
            <button
              onClick={clearWishlist}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear Wishlist
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Test Instructions
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
            <ol className="list-decimal list-inside space-y-2">
              <li>Add items to cart and wishlist while not logged in</li>
              <li>Sign in - items should remain</li>
              <li>Add more items while logged in</li>
              <li>Sign out - UI should clear but data preserved</li>
              <li>Sign in again - items should restore</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPersistence;
