import { db, doc, getDoc } from 'components/firestore';

// data 반환
const loadGroup = async ({ groupId }) => {
  const docSnap = await getDoc(doc(db, 'groups', groupId)); // first logic
  if (docSnap.exists()) {
    const data = docSnap.data(); // doc의 data들
    return data;
  } else {
    return null;
  }
};

export default loadGroup;
