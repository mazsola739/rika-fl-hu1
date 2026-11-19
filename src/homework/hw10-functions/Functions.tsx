import { ExampleTable } from '../../components/ExampleTable'
import { examples } from './examples'
import source from './helpers.ts?raw'

export default function Functions() {
  return <ExampleTable examples={examples} source={source} />
}
