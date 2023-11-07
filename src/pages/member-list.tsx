import MemberListTable from "~/components/MemberList/MemberListTable";
import { Layout } from "~/components/Shared/Layout";

const MemberList = () => {
  return (
    <>
      <Layout>
        <div
          className="flex flex-col justify-center pt-[80px]"
          style={{ fontFamily: "Kanit" }}
        >
          <MemberListTable />
        </div>
      </Layout>
    </>
  );
};

export default MemberList;
