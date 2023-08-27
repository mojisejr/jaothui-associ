import Modal from "../Shared/Modal";

interface MemberSearchByNameDialogProps {
  users: { name: string; wallet: string; type: boolean }[];
}

const MemberSearchByNameDialog = ({
  users = [],
}: MemberSearchByNameDialogProps) => {
  return (
    <Modal id="search_by_name_dialog">
      <>
        {users.length <= 0 ? (
          <div>Not Found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>wallet</th>
                    <th>name</th>
                    <th>type</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="hover">
                      <td>{`${user.wallet.slice(0, 5)}...${user.wallet.slice(
                        38
                      )}`}</td>
                      <td>{user.name}</td>
                      <td>{user.type ? "ตลอดชีพ" : "รายปี"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </>
    </Modal>
  );
};
export default MemberSearchByNameDialog;
