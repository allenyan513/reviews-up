'use client';
import React, { useRef } from 'react';
import { BiUser } from 'react-icons/bi';

export default function Avatar(props: { name: string; url: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
      {props.url ? (
        <img
          src={props.url}
          alt={props.name}
          className="w-10 h-10 object-cover rounded-full"
        />
      ) : (
        // <BiUser className="text-2xl" />
        // first letter of name
        <span className="text-2xl font-bold">
          {props.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
