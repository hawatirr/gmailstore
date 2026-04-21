export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Digital Store - Coming Soon
        </p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left">
        <div className="row-start-1 row-end-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Selamat Datang di Digital Store</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Platform jual beli produk digital dengan auto-payment dan auto-delivery
          </p>
        </div>
      </div>
    </main>
  );
}
