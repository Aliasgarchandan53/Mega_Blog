import React, { Children } from 'react'

function Button({
    children,
    type='button',
    bgColor="bg-blue-600",
    textColor='text-white',
    className='',
    ...props //adding additional properties
}) {
  return (
    <button
    type={type}
    className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`}
    {...props} //including additional props
    >
        {children}
    </button>
  )
}

export default Button
