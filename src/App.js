import './App.css'
import React from 'react'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { gql, useQuery, useMutation } from '@apollo/client'

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: 'https://busy-ellis.herokuapp.com/v1/graphql',
		headers: {
			'x-hasura-admin-secret': sessionStorage.getItem('secret'),
		},
	}),
})

const query = gql`
	query {
		data {
			date
			data
		}
	}
`

const mutation = gql`
	mutation($date: date, $data: jsonb) {
		insert_data_one(object: { date: $date, data: $data }) {
			date
			data
		}
	}
`

function App() {
	const { loading, error, data } = useQuery(query, { client })
	const [addData, { loading: mutationLoading }] = useMutation(mutation, {
		client,
	})
	console.log('your data', data)

	const formRef = React.createRef()

	const setSecret = () => {
		const secret = window.prompt('Password?')
		sessionStorage.setItem('secret', secret)
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		console.log('form submitted', formRef.current)
		const form = formRef.current

		const formData = [...form.elements].reduce(
			(memo, { name, value }) => {
				if (name && !name.includes('.')) {
					memo[name] = value
				} else if (name) {
					eval(`memo.${name}="${value}"`)
				}

				return memo
			},
			{
				food: {},
				sports: {},
				outside: {},
				symptoms: {
					morning: {},
					afternoon: {},
					evening: {},
					night: {},
				},
			}
		)

		console.log('formData is', formData)

		addData({
			variables: {
				date: formData.date,
				data: formData,
			},
		})
	}

	if (loading) return <div>Loading</div>
	if (error)
		return (
			<div>
				<h1 onClick={setSecret}>Outside Inside</h1>
				<p>Error :(</p>
			</div>
		)

	return (
		<ApolloProvider client={client}>
			<div className="App">
				<h1 onClick={setSecret}>Outside Inside</h1>

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
				<form ref={formRef} onSubmit={handleSubmit}>
					<label>
						Date{' '}
						<input autoFocus={true} required={true} type="date" name="date" />
					</label>
					<label>
						Medicine <input name="medicine" />
					</label>
					<label>
						Medicine time{' '}
						<select name="medicineTime">
							<option>morning</option>
							<option>evening</option>
						</select>
					</label>
					<label>
						Bedtime <input type="time" name="bedtime" />
					</label>
					<label>
						Wake up time <input type="time" name="waketime" />
					</label>
					<p>Number of hours slept: </p>
					<label>
						Dinner time <input type="time" name="dinnertime" />
					</label>
					<label>
						Breakfast <textarea name="food.breakfast" />
					</label>
					<label>
						Lunch <textarea name="food.lunch" />
					</label>
					<label>
						Dinner <textarea name="food.dinner" />
					</label>
					<label>
						Sports
						<select name="sports.name">
							<option>yoga</option>
						</select>
					</label>
					<label>
						Sports time
						<select name="sports.time">
							<option>morning</option>
							<option>evening</option>
						</select>
					</label>
					Outside?
					<label>
						<input type="radio" name="outside.value" value="true" /> Yes
					</label>
					<label>
						<input type="radio" name="outside.value" value="false" /> No
					</label>
					<label>
						Outside activity <input name="outside.details" />
					</label>
					Menstruation
					<label>
						<input type="radio" name="menstruation" value="true" /> Yes
					</label>
					<label>
						<input type="radio" name="menstruation" value="false" /> No
					</label>
					<h3>Symptoms</h3>
					<table border="1">
						<tbody>
							<tr>
								<td></td>
								<td>Sneezing</td>
								<td>Itchy eyes</td>
								<td>Runny nose</td>
								<td>Itchy throat</td>
								<td>Headache</td>
								<td>Breathing problems</td>
								<td>Tummy problems</td>
								<td>Others</td>
							</tr>
							<tr>
								<td>Morning</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.morning.sneezing"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.morning.itchyEyes"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.morning.runnyNose"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.morning.itchyThroat"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.morning.headache"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.morning.breathingProblems"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.morning.tummyProblems"
									/>
								</td>
								<td>
									<input name="symptoms.morning.others" />
								</td>
							</tr>
							<tr>
								<td>Afternoon</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.afternoon.sneezing"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.afternoon.itchyEyes"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.afternoon.runnyNose"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.afternoon.itchyThroat"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.afternoon.headache"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.afternoon.breathingProblems"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.afternoon.tummyProblems"
									/>
								</td>
								<td>
									<input name="symptoms.afternoon.others" />
								</td>
							</tr>
							<tr>
								<td>Evening</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.evening.sneezing"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.evening.itchyEyes"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.evening.runnyNose"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.evening.itchyThroat"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.evening.headache"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.evening.breathingProblems"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.evening.tummyProblems"
									/>
								</td>
								<td>
									<input name="symptoms.evening.others" />
								</td>
							</tr>
							<tr>
								<td>Night</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.night.sneezing"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.night.itchyEyes"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.night.runnyNose"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.night.itchyThroat"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.night.headache"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.night.breathingProblems"
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										max="3"
										name="symptoms.night.tummyProblems"
									/>
								</td>
								<td>
									<input name="symptoms.night.others" />
								</td>
							</tr>
						</tbody>
					</table>
					<footer>
						<button type="submit" disabled={mutationLoading}>
							Submit
						</button>
						<button type="reset">Reset</button>
					</footer>
				</form>
			</div>
		</ApolloProvider>
	)
}

export default App
