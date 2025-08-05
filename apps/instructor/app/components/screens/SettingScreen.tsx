'use client'
import { useState } from 'react'
import { useClerkUser } from '../../hooks/useClerkUser'
import axios from "axios"
import { useGetAllPermissionsQuery } from "../../redux//services/permission.services"; 
import { useAddUserPermissionMutation, useRemoveUserPermissionMutation } from '../../redux/services/userPermission.services'
import Image from 'next/image'

export default function SettingScreen() {
  const { user } = useClerkUser();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    (user?.publicMetadata?.permission as string[]) || []
  );

  const [addUserPermission] = useAddUserPermissionMutation();
  const [removeUserPermission] = useRemoveUserPermissionMutation();
  const { data: allPermissions = { data: [] }, refetch, isLoading } = useGetAllPermissionsQuery(); // Fetch permissions

  const handleCheckboxChange = async (permissionId: string, permissionName: string) => {
    const isAlreadySelected = selectedPermissions.includes(permissionName);
    console.log("permissions id", permissionId)
    console.log("user id", user?.id)
  
    if (isAlreadySelected) {
      // Remove permission (send ID but check with name)
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permissionName));
      await removeUserPermission({ userId: user?.id, permissionId: permissionId });
    } else {
      // Add permission (send ID but check with name)
      setSelectedPermissions([...selectedPermissions, permissionName]);
      await addUserPermission({ userId: user?.id, permissionId: permissionId });
    }
  };

  const syncUser = async()=> {
    try{
      const response = await axios.post('/api/user/sync')
      console.log(response)
      return response.data
    }catch(error){
        throw error
    }
  }

  console.log("PERMISSIONS", allPermissions)


  return (
    <div className="flex flex-col items-center justify-center min-h-[358px] mt-32">
      <div className="w-[70%] border-b border-b-[#E9EAEC] pb-6 flex items-center justify-start mx-auto ">
        <div className="h-fit">
          <h1 className="text-[30px] font-bold mb-4 text-[#1D1D1D]">Settings</h1>
          <div>
            <h2 className="text-xl font-semibold text-[#1D1D1D]">Profile</h2>
            <p className="font-normal text-base mt-2 text-[#5F6165]">Update your details here.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-[70%] gap-16 mt-8">

      <div className='flex items-center gap-6'>
      <div className="flex flex-col w-[35%] h-[45px]">
        <label htmlFor="name" className="mb-2 text-sm font-medium text-[#7C7C8D]">First Name</label>
        <div className="flex items-center border border-[#E9EAEC] rounded-lg px-3 py-2">
          <Image 
            src={'/assets/userAvatar.svg'} 
            alt="Avatar" 
            // fill
            
            width={24}
            height={24}
            className=" mr-2 w-[24px] h-[24px]"
          />
          <input 
            id="name" 
            type="text" 
            placeholder="Zuichi" 
            className="w-full outline-none border-none text-[#5F6165] font-medium text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col w-[35%] h-[45px]">
        <label htmlFor="name" className="mb-2 text-sm font-medium text-[#7C7C8D]">Last Name</label>
        <div className="flex items-center border border-[#E9EAEC] rounded-lg px-3 py-2">
          <Image 
            src={'/assets/userAvatar.svg'} 
            alt="Avatar" 
            // fill
            width={24}
            height={24}
            className=" mr-2 w-[24px] h-[24px]"
          />
          <input 
            id="name" 
            type="text" 
            placeholder="Switzerland" 
            className="w-full outline-none border-none text-[#5F6165] font-medium text-sm"
          />
        </div>
      </div>
      </div>

      <div className='flex items-center gap-6'>
      <div className="flex flex-col w-[35%] h-[45px]">
        <label htmlFor="email" className="mb-2 text-sm font-medium text-[#7C7C8D]">Email Address</label>
        <div className="flex items-center border border-[#E9EAEC] rounded-lg px-3 py-2">
          <Image 
            src={'/assets/emailAvatar.svg'} 
            alt="Avatar" 
            // fill/
            width={26}
            height={26}
            className=" mr-2 w-[26px] h-[26px]"
          />
          <input 
            id="email" 
            type="email" 
            placeholder="uihutofficial@gmail.com" 
            className="w-full outline-none border-none text-[#5F6165] font-medium text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col w-[35%] h-[45px]">
        <label htmlFor="email" className="mb-2 text-sm font-medium text-[#7C7C8D]">Password</label>
        <div className="flex items-center border border-[#E9EAEC] rounded-lg px-3 py-2">
          <Image 
            src={'/assets/lock.svg'} 
            // fill
            
            width={26}
            height={26}
            alt="Avatar" 
            className=" mr-2 w-[26px] h-[26px]"
          />
          <input 
            id="password" 
            type="password" 
            placeholder="******" 
            className="w-full outline-none border-none text-[#5F6165] font-medium text-sm"
          />
        </div>
      </div>
      </div>

      <button className='w-28 h-10 rounded-md text-white bg-[#00AFF0] text-center cursor-pointer' onClick={syncUser}>Sync user</button>
      
      <h2 className="text-xl font-semibold text-[#1D1D1D]">User Permissions</h2>
      {isLoading ? (
        <p>Loading permissions...</p>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
        {allPermissions.data?.map((perm: any) => (
              <label key={perm.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  
                  checked={selectedPermissions.includes(perm.name)} // Match by name
                  onChange={() => handleCheckboxChange(perm.id, perm.name)} // Send ID, but check by name
                />
                <span>{perm.name}</span>
              </label>
            ))}
        </div>
      )}

      </div>
    </div>
  );
}
