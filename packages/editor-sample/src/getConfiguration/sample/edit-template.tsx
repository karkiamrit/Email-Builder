import { TEditorConfiguration } from "../../documents/editor/core";
import { useFetchNotification } from "./hook/useFetchNotification";

type Notification = {
  id: number,
  title: string,
  html_content: string;
  text_content: string;
  subject: string;
}

export default function MyTemplate({ template }: { template: any }): TEditorConfiguration {
  console.log(JSON.stringify(template));

  let EDIT_TEMPLATE: TEditorConfiguration;
  if(template){
    EDIT_TEMPLATE = JSON.parse(template);
  }
  else{
    EDIT_TEMPLATE =  {
      root: {
        type: 'EmailLayout',
        data: {
          backdropColor: '#F5F5F5',
          canvasColor: '#FFFFFF',
          textColor: '#262626',
          fontFamily: 'MODERN_SANS',
          childrenIds: [],
        },
      },
    };
  }
   return EDIT_TEMPLATE;
};