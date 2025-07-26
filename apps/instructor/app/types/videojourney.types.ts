export type Asset = {
    type: string;
    companyName: string;
    name: string;
    size: string | null;
    duration: string | null;
    src: string;
    icon: string;
  };
  
  // Redux State Type Definition
 export interface RootState {
    sidebar: {
      persistent: boolean;
    };
  }


  

