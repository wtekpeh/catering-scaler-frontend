import { useParams } from "react-router-dom";

const CookBatchDetailScreen = () => {
  const { id } = useParams();
  return <div>Detail screen for batch #{id} (next)</div>;
};

export default CookBatchDetailScreen;
