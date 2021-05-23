import React, { useEffect, useState } from "react";
import { db } from "../utils/dbInit";
// import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { Wallet } from "../utils/types";

const IndexPage = () => {
  // const dispatch = useDispatch();

  // const checkAccounts = async () => {
  //   //we use eth_accounts because it returns a list of addresses owned by us.
  //   if (typeof window !== undefined) {
  //     const mmAccounts = await window.ethereum.request({method: 'eth_accounts'});
  //     setAccounts(mmAccounts);
  //     dispatch({
  //       type: 'SET_ACCOUNTS',
  //       payload: {
  //         accounts: mmAccounts,
  //       },
  //     });
  //     await getBalance();
  //   } else {
  //     setAccounts(await []);
  //   }
  // };

  const [wallets, setWallets] = useState<Wallet[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      if (db && !loading) {
        const table = await db.wallets.toArray();
        setWallets(table);
      }
    })();
  }, [db, loading]);

  // console.log(wallets)

  // const wallets = useLiveQuery(
  //   async () => await db.wallets.toArray()
  // );


  console.log(wallets || "NONE");

  return (
    <div
      className={`w-1/2 flex flex-col items-center content-center m-auto text-center mt-20`}
    >
      <button
        onClick={async () => {
          setLoading(true);
          await db.addWallet({
            walletId: "roi",
            name: "hola",
            icon: "icon.png",
          });
          setLoading(false);
        }}
      >
        add wallet
      </button>
    </div>
  );
};

export default IndexPage;
