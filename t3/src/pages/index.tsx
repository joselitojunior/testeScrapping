import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import styles from "./index.module.css";
import { useEffect } from "react";

export default function Home() {
	const google = api.scrapping.title.useQuery().data;

	useEffect(() => {
		console.log(google)
	}, google)

	return (
		<>
			<main>
				<p>{google}</p>
			</main>
		</>
	);
}
