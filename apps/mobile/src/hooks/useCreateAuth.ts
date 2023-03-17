// import { signWithDeviceKey } from "util/auth";

export const useCreateAuth = () => async(devicePublicKey: string) => {
    // const { nonce, userId } = await fetchFromApi<CreateUserResponse>("/user/create", {
    //     body: {
    //       devicePublicKey,
    //     },
    //   });
    
    //   const deviceSignature = await signWithDeviceKey(nonce);
    
    //   const success = await fetchFromApi<boolean>("/user/verify", {
    //     body: {
    //       deviceSignature,
    //       userId,
    //       devicePublicKey,
    //     },
    //     method: HttpMethod.POST,
    //     args: { credentials: "include", headers: { deviceSignature } },
    //   });
    
    //   return {
    //     id: userId,
    //     devicePublicKey,
    //     keyShares: [],
    //     bip44MasterKeyShare: { ...emptyKeyPair, type: KeyShareType.MASTER },
    //   };
}