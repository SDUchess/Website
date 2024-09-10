import { useState } from 'react'


export default function Test() {
  const [toggle1, setToggle1] = useState<boolean>(true)

  return (
    <div>
      <h1>测试</h1>
      <div className="flex items-center">
        <div className="form-switch">
          <input type="checkbox" id="switch-1" className="sr-only" checked={toggle1}
                 onChange={() => setToggle1(!toggle1)}/>
          <label className="bg-slate-400 dark:bg-slate-700" htmlFor="switch-1">
            <span className="bg-white shadow-sm" aria-hidden="true"></span>
            <span className="sr-only">Switch label</span>
          </label>
        </div>
        <div className="text-sm text-slate-400 dark:text-slate-500 italic ml-2">{toggle1 ? '开启' : '关闭'}</div>
      </div>
    </div>
  )
}
