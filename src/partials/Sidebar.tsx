import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import SidebarLinkGroup from './SidebarLinkGroup'

function Sidebar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean, setSidebarOpen: Dispatch<SetStateAction<boolean>> }) {
  const location = useLocation()
  const { pathname } = location

  const trigger = useRef<HTMLButtonElement>(null)
  const sidebar = useRef<HTMLDivElement>(null)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  )

  const userRole = localStorage.getItem('userRole')

  // Close sidebar on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }) => {
      if (!sidebar.current || !trigger.current) return
      if (
        !sidebarOpen ||
        sidebar.current!.contains(target as Node) ||
        trigger.current!.contains(target as Node)
      )
        return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector('body')!.classList.add('sidebar-expanded')
    } else {
      document.querySelector('body')!.classList.remove('sidebar-expanded')
    }
  }, [sidebarExpanded])

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}>
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}>
            <span className="sr-only">关闭菜单</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                {userRole || '未登录'}
              </span>
            </h3>
            <ul className="mt-3">
              {/* 教师菜单 */}
              {userRole === 'teacher' && (
                <SidebarLinkGroup
                  activeCondition={pathname.startsWith('/teacher')}>
                  {(handleClick: Function, open: boolean) => (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('/teacher')
                            ? 'bg-slate-900'
                            : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleClick()
                          setSidebarExpanded(true)
                        }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
                              viewBox="0 0 24 24">
                              <path
                                className={`fill-current ${
                                  pathname.includes('/teacher')
                                    ? 'text-indigo-500'
                                    : 'text-slate-400'
                                }`}
                                d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes('/teacher')
                                    ? 'text-indigo-600'
                                    : 'text-slate-600'
                                }`}
                                d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes('/teacher')
                                    ? 'text-indigo-200'
                                    : 'text-slate-400'
                                }`}
                                d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                              />
                            </svg>
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              教师菜单
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && 'rotate-180'
                              }`}
                              viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/teacher/dashboard"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                教师主页
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/teacher/class"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                管理学生
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/teacher/class-manage"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                管理班级
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/teacher/chess"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                挑战录制
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/teacher/chessboardmanagement"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                挑战管理
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              )}
              {/* 学生菜单 */}
              {userRole === 'student' && (
                <SidebarLinkGroup
                  activeCondition={pathname.startsWith('/student')}>
                  {(handleClick: Function, open: boolean) => (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('/student')
                            ? 'bg-slate-900'
                            : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleClick()
                          setSidebarExpanded(true)
                        }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
                              viewBox="0 0 24 24">
                              <path
                                className={`fill-current ${
                                  pathname.includes('/student')
                                    ? 'text-indigo-500'
                                    : 'text-slate-400'
                                }`}
                                d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes('/student')
                                    ? 'text-indigo-600'
                                    : 'text-slate-600'
                                }`}
                                d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes('/student')
                                    ? 'text-indigo-200'
                                    : 'text-slate-400'
                                }`}
                                d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                              />
                            </svg>
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              学生菜单
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && 'rotate-180'
                              }`}
                              viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/student/dashboard"
                              className={({isActive}) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span
                                className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                学生主页
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/student/chessboard"
                              className={({isActive}) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span
                                className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                班级挑战
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/student/basicChessboard"
                              className={({isActive}) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span
                                className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                基础挑战
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              )}
              {/* 管理员菜单 */}
              {userRole === 'admin' && (
                <SidebarLinkGroup
                  activeCondition={pathname.startsWith('/admin')}>
                  {(handleClick: Function, open: boolean) => (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('/admin')
                            ? 'bg-slate-900'
                            : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleClick()
                          setSidebarExpanded(true)
                        }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
                              viewBox="0 0 24 24">
                              <path
                                className={`fill-current ${
                                  pathname.includes('/student')
                                    ? 'text-indigo-500'
                                    : 'text-slate-400'
                                }`}
                                d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes('/student')
                                    ? 'text-indigo-600'
                                    : 'text-slate-600'
                                }`}
                                d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes('/student')
                                    ? 'text-indigo-200'
                                    : 'text-slate-400'
                                }`}
                                d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                              />
                            </svg>
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              管理员菜单
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && 'rotate-180'
                              }`}
                              viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/admin/chessboard"
                              className={({isActive}) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span
                                className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                基础挑战管理
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/admin/chess"
                              className={({isActive}) =>
                                'block transition duration-150 truncate ' +
                                (isActive
                                  ? 'text-indigo-500'
                                  : 'text-slate-400 hover:text-slate-200')
                              }>
                              <span
                                className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                录制基础挑战
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>
              )}
              {/* 测试页面 */}
              <SidebarLinkGroup
                activeCondition={true}>
                {(_handleClick: Function, open: boolean) => (
                  <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                    <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                      <li className="mb-1 last:mb-0">
                        <NavLink
                          to="/test"
                          className={({isActive}) =>
                            'block transition duration-150 truncate ' +
                            (isActive
                              ? 'text-indigo-500'
                              : 'text-slate-400 hover:text-slate-200')
                          }>
                          <span
                            className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            测试页面 (仅用于开发)
                          </span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                )}
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24">
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
