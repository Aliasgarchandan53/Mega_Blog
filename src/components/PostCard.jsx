import React from "react";
import appwriteService from "../appwrite/configdb";
import {Link} from "react-router-dom";

function PostCard({ $id, title, featuredimageid }) {
  // console.log("Post card : ",{ $id, title, featuredImage })
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={appwriteService.getFilePreview(featuredimageid)}
            alt={title}
            className="rounded-xl"
          />
        </div>
        <h2 className='text-xl font-bold' >{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
