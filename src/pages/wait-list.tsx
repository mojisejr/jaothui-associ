import { Layout } from "~/components/Shared/Layout";
import WaitListTable from "~/components/WaitList/WaitListTable";

const MemberList = () => {
  return (
    <>
      <Layout>
        <div
          className="flex flex-col justify-center pt-[80px]"
          style={{ fontFamily: "Kanit" }}
        >
          <WaitListTable />
        </div>
      </Layout>
    </>
  );
};

export default MemberList;
