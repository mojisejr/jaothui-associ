import { RefObject, useRef } from "react";
import Loading from "../Shared/LoadingIndicator";

interface MemberNameEditProps {
  title: string;
  content: string;
  placeholder: string;
  buttonName: string;
  action?: (
    prefixRef: RefObject<HTMLSelectElement>,
    nameRef: RefObject<HTMLInputElement>,
    lastnamRef: RefObject<HTMLInputElement>
  ) => void;
  disabled: boolean;
  loading: boolean;
}

export default function MemberNameEdit({
  title,
  content,
  placeholder,
  buttonName,
  disabled,
  loading,
  action,
}: MemberNameEditProps) {
  const prefixRef = useRef<HTMLSelectElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="collapse-arrow join-item collapse border border-base-300">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title">
          <div className="text-md  font-medium text-slate-600">{title}</div>
          <div className="text-slate-500">{content}</div>
        </div>
        <div className="collapse-content flex flex-col">
          <div className="form-control">
            <select
              ref={prefixRef}
              disabled={disabled}
              className="input-bordered input input-sm max-w-md"
            >
              <option selected disabled>
                เลือก
              </option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
            </select>
          </div>
          <div className="form-control">
            <input
              ref={nameRef}
              required
              disabled={disabled}
              placeholder={"ชื่อ"}
              className="input-bordered input input-sm max-w-md"
            ></input>
          </div>
          <input
            ref={lastNameRef}
            required
            disabled={disabled}
            placeholder="นามสกุล"
            className="input-bordered input input-sm max-w-md"
          ></input>
          <button
            disabled={disabled}
            onClick={
              action ? () => action(prefixRef, nameRef, lastNameRef) : undefined
            }
            className="btn-primary btn-outline btn-sm btn"
          >
            {loading ? <Loading /> : buttonName}
          </button>
        </div>
      </div>
    </>
  );
}
