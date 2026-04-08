import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    symbol: string;
  }>;
};

export default async function TokenAliasPage({ params }: Props) {
  const { symbol } = await params;
  redirect(`/symbol/${symbol.toUpperCase()}`);
}