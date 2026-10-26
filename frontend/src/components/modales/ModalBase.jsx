import ReactModal from 'react-modal';

export default function ModalBase({ size = 'md', className = '', children, contentLabel = 'Ventana del almacén', ...props }) {
  return <ReactModal {...props} contentLabel={contentLabel}
    appElement={props.appElement || document.getElementById('root')}
    className={`
      am-dialog [--am-ink:#274563] [--am-muted:#6b7f99] relative bg-white text-[var(--am-ink)] rounded-[22px] w-full
      max-h-[calc(100dvh_-_56px)] overflow-auto [outline:none]
      [&&]:[box-shadow:0_30px_100px_#05163066,_0_4px_14px_#05163033] text-[length:14px] animate-am-enter
      [scrollbar-width:thin] [scrollbar-color:#c4d4eb_#f6f9fd] border border-solid [&&]:border-[#b8cdec]
      max-[650.001px]:rounded-[18px] max-[650.001px]:max-h-[calc(100dvh_-_28px)]
      [@media(prefers-reduced-motion:_reduce)]:animate-none [&_button]:cursor-pointer
      [&_button]:[transition:background_.18s,_border-color_.18s,_color_.18s,_box-shadow_.18s]
      [&_button]:rounded-[9px] [&_button:disabled]:cursor-default [&_button:disabled]:opacity-[.5]
      [&_button:focus-visible]:[outline:3px_solid_#a7c8fa] [&_button:focus-visible]:[outline-offset:3px]
      [&_a:focus-visible]:[outline:3px_solid_#a7c8fa] [&_a:focus-visible]:[outline-offset:3px]
      [&_input:focus-visible]:[outline:3px_solid_#a7c8fa] [&_input:focus-visible]:[outline-offset:3px]
      [&_select:focus-visible]:[outline:3px_solid_#a7c8fa] [&_select:focus-visible]:[outline-offset:3px]
      [&_textarea:focus-visible]:[outline:3px_solid_#a7c8fa] [&_textarea:focus-visible]:[outline-offset:3px]
      [&_h3]:text-[#486484] [&_h4]:text-[#486484] [&_label]:text-[length:13px] [&_label]:font-[550]
      [&&_label]:text-[#365374] [&_label]:leading-[1.5]
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:min-h-[42px]
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:rounded-[10px]
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:[background:#fafcff]
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:text-[#405e83]
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:text-[length:14px]
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:[transition:border-color_.18s,box-shadow_.18s,background_.18s]
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:border
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:border-solid
      [&_input:not([type='checkbox']):not([type='radio']):not([type='color']):not([type='file']):not([role='combobox'])]:border-[#dce5f2]
      [&_select]:min-h-[42px] [&_select]:rounded-[10px] [&_select]:[background:#fafcff] [&_select]:text-[#405e83]
      [&_select]:text-[length:14px] [&_select]:[transition:border-color_.18s,box-shadow_.18s,background_.18s]
      [&_select]:border [&_select]:border-solid [&_select]:border-[#dce5f2] [&_textarea]:min-h-[42px]
      [&_textarea]:rounded-[10px] [&_textarea]:[background:#fafcff] [&_textarea]:text-[#405e83]
      [&_textarea]:text-[length:14px] [&_textarea]:[transition:border-color_.18s,box-shadow_.18s,background_.18s]
      [&_textarea]:leading-[1.7] [&_textarea]:border [&_textarea]:border-solid [&_textarea]:border-[#dce5f2]
      [&_input::placeholder]:text-[#8294ac] [&_textarea::placeholder]:text-[#8294ac]
      [&_input:focus]:[box-shadow:0_0_0_3px_#9abcf21e] [&_input:focus]:bg-white [&_input:focus]:border-[#8fb3ea]
      [&_select:focus]:[box-shadow:0_0_0_3px_#9abcf21e] [&_select:focus]:bg-white [&_select:focus]:border-[#8fb3ea]
      [&_textarea:focus]:[box-shadow:0_0_0_3px_#9abcf21e] [&_textarea:focus]:bg-white
      [&_textarea:focus]:border-[#8fb3ea] [&_input:disabled]:[background:#f2f5fa] [&_input:disabled]:text-[#8292a8]
      [&_input:disabled]:cursor-default [&_select:disabled]:[background:#f2f5fa] [&_select:disabled]:text-[#8292a8]
      [&_select:disabled]:cursor-default [&_textarea:disabled]:[background:#f2f5fa]
      [&_textarea:disabled]:text-[#8292a8] [&_textarea:disabled]:cursor-default
      [&_input[type='checkbox']]:[accent-color:#547fc6] [&_input[type='radio']]:[accent-color:#547fc6]
      [&_.border-red-300]:border-[#dfa5ae]! [&_.border-red-400]:border-[#dfa5ae]! [&_.text-gray-400]:text-[#718198]
      [&_.text-gray-500]:text-[#718198] [&_.text-slate-500]:text-[#718198] [&_.text-gray-600]:text-[#5e7390]
      [&_.text-slate-600]:text-[#5e7390] [&_.text-gray-700]:text-[#3e5978] [&_.text-gray-800]:text-[#3e5978]
      [&_.text-gray-900]:text-[#3e5978] [&_.text-red-500]:text-[#ac5c6d] [&_.text-red-600]:text-[#ac5c6d]
      [&_.text-red-700]:text-[#ac5c6d] [&_.text-amber-600]:text-[#926e3c] [&_.text-amber-700]:text-[#926e3c]
      [&_.text-yellow-700]:text-[#926e3c] [&_.bg-gray-50]:[background:#f7f9fd] [&_.bg-slate-50]:[background:#f7f9fd]
      [&_.border-gray-200]:border-[#e5ebf5] [&_.border-slate-200]:border-[#e5ebf5] [&_.text-xs]:text-[length:12px]
      [&_.text-xs]:leading-[1.6] [&_button[type='submit']]:inline-flex [&_button[type='submit']]:items-center
      [&_button[type='submit']]:justify-center [&_button[type='submit']]:gap-[7px] [&_button[type='submit']]:min-h-10
      [&_button[type='submit']]:pt-[9px] [&_button[type='submit']]:pr-[15px] [&_button[type='submit']]:pb-[9px]
      [&_button[type='submit']]:pl-[15px] [&_button[type='submit']]:rounded-[10px]
      [&_button[type='submit']]:text-[length:13px] [&_button[type='submit']]:font-semibold
      [&_button[type='submit']]:leading-[1.5] [&_button[type='submit']]:no-underline
      [&&_button[type='submit']]:[background:#1859d5] [&_button[type='submit']]:text-white
      [&&_button[type='submit']]:[box-shadow:0_4px_12px_#1859d533] [&_button[type='submit']]:border
      [&_button[type='submit']]:border-solid [&&_button[type='submit']]:border-[#1859d5]
      [&&_button[type='submit']:hover:not(:disabled)]:[background:#1348b0]
      [&&_button[type='submit']:hover:not(:disabled)]:border-[#1348b0]
      [@media(prefers-reduced-motion:_reduce)]:[&_*]:[transition:none]!
    ${{
  "sm": "am-size-sm [&.am-size-sm]:max-w-110",
  "md": "am-size-md [&.am-size-md]:max-w-[530px]",
  "lg": "am-size-lg [&.am-size-lg]:max-w-180",
  "xl": "am-size-xl [&.am-size-xl]:max-w-240"
}[size] || ""}   ${className}  `} overlayClassName="
  fixed top-0 right-0 bottom-0 left-0 z-[60] flex items-center justify-center pt-7 pr-7 pb-7 pl-7
  [&&]:[background:#071b3c9c] [&&]:[backdrop-filter:blur(6px)] [overscroll-behavior:contain] animate-am-fade
  max-[650.001px]:pt-[14px] max-[650.001px]:pr-[14px] max-[650.001px]:pb-[14px] max-[650.001px]:pl-[14px]
  [@media(prefers-reduced-motion:_reduce)]:animate-none
"
    portalClassName="am-portal" bodyOpenClassName="overflow-hidden">
    {children}
  </ReactModal>;
}
