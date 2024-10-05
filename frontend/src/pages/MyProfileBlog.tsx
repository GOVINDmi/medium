
import { MyProfileFullBlog } from "../components/MyProfileFullBlog";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks";
import {useParams} from "react-router-dom";

// atomFamilies/selectorFamilies
export const MyProfileBlog = () => {
    const { id} = useParams();
    const {loading, blog} = useBlog({
        id: id || ""
    });
    

    if (loading || !blog) {
        return <div>
            
           
        
            <div className="h-screen flex flex-col justify-center">
                
                <div className="flex justify-center">
                    <Spinner />
                </div>
            </div>
        </div>
    }
    return <div>
        <MyProfileFullBlog blog={blog} />
    </div>
} 