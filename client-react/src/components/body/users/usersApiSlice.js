import { buildCreateApi } from "@reduxjs/toolkit/query";
import apiSlice from "../../../app/apiSlice";
const usersApiSlice=apiSlice.injectEndpoints({
    endpoints:(build)=>({
        getUsers:build.query({
            query:()=>({
                url:"/api/user"
            }),
            providesTags:["Users"]
        }) ,
        addUser:build.mutation({
            query:(user)=>({
                url:"/api/user",
                method:"POST",
                body:user
            }),
            invalidatesTags:["Users"]
        }),
        deleteUser:build.mutation({
            query:({id})=>({
                url:`/api/user/${id}`,////////////////?????????????????????????
                method:"DELETE",
               // body:{id}//////////////////???????????????????????
            }),
            invalidatesTags:["Users"]
            })
        })
    })

export default {useGetUsersQuery,useAddUserMutation,useDeleteUserMutation}=usersApiSlice