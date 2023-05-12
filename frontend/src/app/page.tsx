import NewTransactionButton from "./components/NewTransactionButton";

export default function Home() {
  return (
    <main className="flex items-center justify-between p-24">
      <div>
        <div>Multi-sig Balance: 1 ETH</div>
        <div>
          <NewTransactionButton />
        </div>
      </div>
      <div>
        <h2>Accounts</h2>
        <div>0x1234</div>
        <div>0x1234</div>
        <div>0x1234</div>
      </div>
    </main>
  );
}
