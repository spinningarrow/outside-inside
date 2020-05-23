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
			'x-hasura-admin-secret': sessionStorage.getItem('secret')
		}
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
	const [addData, result] = useMutation(mutation, { client })

	const formRef = React.createRef()

	const handleSubmit = (event) => {
		event.preventDefault()
		console.log('form submitted', formRef.current)
		const form = formRef.current
		const data = {
			date: form.date.value,
			medicine: form.medicine.value,
			medicineTime: form.medicineTime.value,
			bedtime: form.bedtime.value,
			waketime: form.waketime.value,
			symptoms: {
				morning: {
					others: form['morningSymptoms-others'].value,
				},
			},
		}
		console.log({ data })

		addData({
			variables: {
				date: data.date,
				data,
			},
		})
	}

	if (loading) return <div>Loading</div>
	if (error) return <div>Error: {error}</div>

	return (
		<ApolloProvider client={client}>
			<div className="App">
				<p>HELLO Xenia</p>
				{JSON.stringify(data.data)}
				<form ref={formRef} onSubmit={handleSubmit}>
					<label>
						Date <input type="date" name="date" />
					</label>
					<label>
						Medicine <input name="medicine" />
					</label>
					<label>
						Medicine time{' '}
						<select name="medicineTime">
							<option>Morning</option>
							<option>Evening</option>
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
						Breakfast <textarea />
					</label>
					<label>
						Lunch <textarea />
					</label>
					<label>
						Dinner <textarea />
					</label>

					<label>
						Training{' '}
						<select>
							<option>Yoga</option>
						</select>
					</label>
					<label>
						Training time{' '}
						<select>
							<option>Morning</option>
							<option>Evening</option>
						</select>
					</label>

					<label>
						Outside? <input type="radio" /> Yes
					</label>
					<label>
						Outside activity <input />
					</label>

					<label>
						Menstruation <input type="radio" /> Yes
					</label>

					<h3>Symptoms</h3>

					<h4>Morning</h4>
					<p>
						Sneezing <input type="radio" /> 0 <input type="radio" /> 1
					</p>
					<p>
						Itchy eyes <input type="radio" /> 0 <input type="radio" /> 1
					</p>
					<p>
						Runny nose <input type="radio" /> 0 <input type="radio" /> 1
					</p>
					<p>
						Itchy throat <input type="radio" /> 0 <input type="radio" /> 1
					</p>
					<p>
						Headache <input type="radio" /> 0 <input type="radio" /> 1
					</p>
					<p>
						Breathing problems <input type="radio" /> 0 <input type="radio" /> 1
					</p>
					<p>
						Tummy problems <input type="radio" /> 0 <input type="radio" /> 1
					</p>
					<p>
						Others <input name="morningSymptoms-others" />
					</p>

					<h4>Lunch</h4>
					<p>
						Sneezing <input type="radio" /> 0 <input type="radio" /> 1
					</p>

					<h4>Afternoon</h4>
					<p>
						Sneezing <input type="radio" /> 0 <input type="radio" /> 1
					</p>

					<h4>Evening</h4>
					<p>
						Sneezing <input type="radio" /> 0 <input type="radio" /> 1
					</p>

					<h4>Night</h4>
					<p>
						Sneezing <input type="radio" /> 0 <input type="radio" /> 1
					</p>

					<button type="submit">Submit</button>
					<button type="reset">Reset</button>
				</form>
			</div>
		</ApolloProvider>
	)
}

export default App
