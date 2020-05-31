import React from 'react'
import { gql, useQuery } from '@apollo/client'

const query = gql`
	query {
		data(order_by: { date: desc }) {
			date
			data
		}
	}
`

const Overview = () => {
	const { loading, error, data } = useQuery(query)

	if (loading) return <div>Loading</div>

	if (error) {
		return <p>Error :(</p>
	}

	return (
		<details>
			<summary>Your data</summary>
			<table border="1">
				<thead>
					<tr>
						<th>Date</th>
						<th>Data</th>
					</tr>
				</thead>
				<tbody>
					{data.data.map(({ date, data }) => (
						<tr key={date}>
							<td>{date}</td>
							<td>
								<pre>{JSON.stringify(data, null, 2)}</pre>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</details>
	)
}

export default Overview
