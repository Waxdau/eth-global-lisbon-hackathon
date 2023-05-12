"use client";

const NewTransactionButton = () => {
  const newTransaction = () => {
    console.log("Pressed the button");
  };
  return (
    <button onClick={newTransaction} className="p-2 rounded-lg bg-green-500">
      New Transaction
    </button>
  );
};
export default NewTransactionButton;
