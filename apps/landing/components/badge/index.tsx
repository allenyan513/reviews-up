import {Turbo0} from "@/components/badge/turbo0";
import {Startupfa} from "@/components/badge/startupfa";


export function Badge(){
  return (
    <div className="flex flex-row gap-2">
      <Turbo0/>
      <Startupfa/>
    </div>
  )
}
