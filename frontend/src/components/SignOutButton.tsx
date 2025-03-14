import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
const SignOutButton=()=>{
    const queryCLient=useQueryClient();
    const {showToast}=useAppContext();
    const mutation=useMutation(apiClient.signOut,{
        onSuccess:async()=>{
            await queryCLient.invalidateQueries("validateToken")
            showToast({message:"Signed Out!",type:"SUCCESS"});
        },
        onError:(error:Error)=>{
            showToast({message:error.message,type:"ERROR"})
        }
    });

    const handleClick=()=>{
        mutation.mutate();
    }
    return(
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold bg-white bover:bg-gray-100">
            Sign Out
        </button>
    )
}
export default SignOutButton;