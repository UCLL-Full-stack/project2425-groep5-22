import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const UserManagementTable: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(true);

  const users = [
    {
      username: 'Superadmin',
      email: 'superadmin@jeugdwerk.org',
      password: 'Superadmin!123',
      role: 'Superadmin'
    },
    {
      username: 'Admin',
      email: 'admin@jeugdwerk.org',
      password: 'Admin!123',
      role: 'Admin'
    },
    {
      username: 'Guest',
      email: 'guest@jeugdwerk.org',
      password: 'Guest!123',
      role: 'Guest'
    }
  ];

  const getRoleStyles = (role: string) => {
    switch (role) {
      case t('Superadmin'):
        return 'bg-red-100 text-red-800';
      case t('Admin'):
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (!visible) {
    return (
      <div className="flex items-center justify-center">
        <button onClick={() => setVisible(true)} className='text-sm underline hover:text-primary'>
          {t('login.userManagement.showUsers')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-6 mx-auto bg-gray-100">
      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="w-full">
          <thead className="bg-white">
            <tr>
              {[
                t('login.userManagement.tableHeaders.username'),
                t('login.userManagement.tableHeaders.email'),
                t('login.userManagement.tableHeaders.password'),
                t('login.userManagement.tableHeaders.role')
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {users.map((user, index) => (
              <tr
                key={index}
                className="transition-colors duration-200 hover:bg-gray-100"
              >
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {user.username}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-gray-500 whitespace-nowrap">
                  {user.password}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 inline-block rounded-full text-xs font-semibold
                    ${getRoleStyles(user.role)}
                  `}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center">
        <button onClick={() => setVisible(false)} className='text-sm underline hover:text-primary'>
          {t('login.userManagement.hideUsers')}
        </button>
      </div>
    </div>
  );
};

export default UserManagementTable;