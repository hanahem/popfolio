import React, { FC } from 'react';
import LeftArrowSmIcon from '../icons/LeftArrowSmIcon';

const BackButton: FC = () => {
    return (
        <div className="flex justify-start items-center p-2 hover:bg-gray-100 rounded cursor-pointer w-max">
            <LeftArrowSmIcon color="#979797"/>
            <p className="mx-2 text-mGray">Back</p>
        </div>
    );
};

export default BackButton;