import { ReactNode, useEffect } from "react";
import ReactDOM from 'react-dom';

type ModalProps = {
  children: ReactNode;
  closeModal : () => void
};

const CrossIcon = (props:React.SVGProps<SVGSVGElement>) => (
	<svg fill='none' stroke='currentColor' viewBox='0 0 24 24' {...props}>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='2'
			d='M6 18L18 6M6 6l12 12'
		></path>
	</svg>
);



export const Modal = ({ children,closeModal }:ModalProps) => {
  useEffect(() => {
    document.body.classList.add('overflow-y-hidden');
    return () => document.body.classList.remove('overflow-y-hidden');
  }, []);

  return ReactDOM.createPortal(
    <div className='modal flex justify-center fixed inset-0 bg-black/50 z-50'>
      <div className='relative bg-white p-6 w-[min(90%,1000px)] self-start mt-5 rounded-lg'>
        {
        <button
          className='absolute top-0 right-0 p-1 text-black'
          onClick={closeModal}
        >
          <CrossIcon className='w-6' />
        </button> 
        }
        
        {children}
      </div>
    </div>, document.getElementById('modal-container')!);
}
