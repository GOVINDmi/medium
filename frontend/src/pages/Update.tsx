import { useLocation } from "react-router-dom";
import { UpdateBlog } from "../components/UpdateBlog";

const Update = () => {
  const location = useLocation();
  const { blog } = location.state;  // Access the passed blog object

  return (
    <div>
         <UpdateBlog blog={blog}/>
    </div>
  );
};

export default Update;
