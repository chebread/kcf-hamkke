import { db, doc, deleteDoc } from 'components/firestore';

const deleteGroup = async ({ groupId }) => {
  await deleteDoc(doc(db, 'groups', groupId));
};

export default deleteGroup;
