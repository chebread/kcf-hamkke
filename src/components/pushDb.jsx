import { db, setDoc, doc } from 'components/firestore';
import hashConstructor from 'components/hashConstructor';

const pushDb = async ({ comment, position }) => {
  console.log(3);
  const { lng, lat } = position;
  const docId = hashConstructor();
  await setDoc(doc(db, 'groups', `${docId}`), {
    comment: comment,
    position: {
      lng: lng,
      lat: lat,
    },
  });
  return docId;
};

export default pushDb;
