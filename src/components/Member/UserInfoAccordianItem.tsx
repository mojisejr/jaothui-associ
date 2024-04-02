import { RefObject, useRef } from "react";
import Loading from "../Shared/LoadingIndicator";

interface UserInfoAccordianItemProps {
  title: string;
  content: string;
  placeholder: string;
  buttonName: string;
  action?: (ref: RefObject<HTMLInputElement>) => void;
  disabled: boolean;
  loading: boolean;
}

export default function UserInfoAccordianItem({
  title,
  content,
  placeholder,
  buttonName,
  disabled,
  loading,
  action,
}: UserInfoAccordianItemProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="collapse-arrow join-item collapse border border-base-300">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title">
          <div className="text-md  font-medium text-slate-600">{title}</div>
          <div className="text-slate-500">{content}</div>
        </div>
        <div className="collapse-content flex">
          <div className="form-control">
            <input
              ref={ref}
              required
              disabled={disabled}
              placeholder={placeholder}
              className="input-bordered input input-sm max-w-md"
            ></input>
          </div>
          <button
            disabled={disabled}
            onClick={action ? () => action(ref) : undefined}
            className="btn-primary btn-outline btn-sm btn"
          >
            {loading ? <Loading /> : buttonName}
          </button>
        </div>
      </div>
    </>
  );
}
