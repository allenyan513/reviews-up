import {Button} from "@/components/ui/button";
import {useCampaignContext} from "@/modules/campaign/context/campaign-provider";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {BiTrash} from "react-icons/bi";
import React from "react";
import {useUserContext} from "@/context/UserProvider";
import {EmailsInput} from "@/components/emails-input";

export function CampaignFormItem(props: {
  label: string;
  children: React.ReactNode;
}) {
  const {label, children} = props;
  return (
    <div className='flex flex-col gap-2'>
      <label className="text-sm font-medium">
        <span className="text-red-500 mr-1">*</span>
        {label}
      </label>
      {children}
    </div>
  )
}

export function CampaignCreateConfigPage() {
  const {user} = useUserContext()
  const {submitForm, setSubmitForm, campaigns, forms, sendCampaign} = useCampaignContext()

  if (!submitForm || !forms || !user) return null;

  return (
    <div className='space-y-4'>

      <CampaignFormItem label="Campaign Name">
        <input
          type="text"
          id="name"
          value={submitForm.name}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              name: e.target.value,
            })
          }
          placeholder="Enter Campaign Name"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </CampaignFormItem>

      <CampaignFormItem label="From Name">
        <input
          type="text"
          id="fromName"
          value={submitForm.fromName}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              fromName: e.target.value,
            })
          }
          placeholder="Enter From Name"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </CampaignFormItem>

      <CampaignFormItem label="From Email">
        <input
          type="text"
          id="fromName"
          value={submitForm.fromEmail}
          disabled={true}
          className="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </CampaignFormItem>

      <CampaignFormItem label="To Emails">
        <EmailsInput
          emails={submitForm.toEmails || []}
          onChange={(emails: string[]) =>
            setSubmitForm({...submitForm, toEmails: emails})
          }/>
      </CampaignFormItem>


      <CampaignFormItem label="Subject">
        <input
          type="text"
          id="subject"
          value={submitForm.subject}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              subject: e.target.value,
            })
          }
          className="w-full p-2 border border-gray-300 rounded"
        />
      </CampaignFormItem>

      <CampaignFormItem label="Content">
       <textarea
         id="message"
         rows={10}
         value={submitForm.content}
         onChange={(e) =>
           setSubmitForm({
             ...submitForm,
             content: e.target.value,
           })
         }
         className="w-full p-2 border border-gray-300 rounded"
       />
      </CampaignFormItem>




      <CampaignFormItem label="Collecting Form">
        <Select
          value={submitForm.formId}
          onValueChange={(value) =>
            setSubmitForm({
              ...submitForm,
              formId: value,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Form ID"/>
          </SelectTrigger>
          <SelectContent>
            {forms.map((form) => (
              <SelectItem key={form.id} value={form.id}>
                {form.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CampaignFormItem>

      <CampaignFormItem label="Button Text">
        <input
          type="text"
          id="buttonText"
          value={submitForm.buttonText}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              buttonText: e.target.value,
            })
          }
          className="w-full p-2 border border-gray-300 rounded"
        />
      </CampaignFormItem>



      <div className='grid grid-cols-2 gap-4'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {/*<BiTrash className={'text-2xl text-red-400 cursor-pointer'}/>*/}
            <Button
              variant='outline'
              size={'lg'}>
              Send Test Email
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {/*确定发送测试邮件吗？*/}
                Are you sure you want to send a test email?
              </AlertDialogTitle>
              <AlertDialogDescription>
                The test email will be sent to <strong className='text-red-500 mx-1'>{user.email}</strong>, please
                ensure the content is correct.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  sendCampaign(true)
                }}
              >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='default'
              size={'lg'}>
              Send Campaign
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to send this campaign?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {/*The test email will be sent to <strong className='text-red-500 mx-1'>{user.email}</strong>, please ensure the content is correct.*/}
                This will send the campaign to all recipients. Please ensure the content is correct and you have
                selected the right form.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  sendCampaign(false)
                }}
              >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </div>
  )
}
