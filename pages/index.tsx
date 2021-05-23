import React, { useEffect, useState } from "react";
import Title from "../components/Generics/Title";
import { db } from "../utils/dbInit";
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

  console.log(wallets || "NONE");

  return (
    <div>
      <Title
        title="Overview"
        subtitle="An overview of your portfolio and assets performance"
      />
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 mt-8"></div>
    </div>
  );
};

export default IndexPage;
