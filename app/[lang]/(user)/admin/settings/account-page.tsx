import React from "react";
import useAction from "@/hooks/useAction";
import {
  addCompanyAccount,
  deleteCompanyAccount,
  getCompanyAccount,
  updateCompanyAccount,
} from "@/actions/admin/company";
import { Button, Input } from "@heroui/react";
import { z } from "zod";
import { companyAccountSchema } from "@/lib/zodSchema";
import { addToast } from "@heroui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

function accountPage() {
  const [response, action, loading] = useAction(getCompanyAccount, [
    ,
    () => {},
  ]);
  return <div></div>;
}

export default accountPage;
