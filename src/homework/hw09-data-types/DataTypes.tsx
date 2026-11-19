import { ExampleTable } from '../../components/ExampleTable'
import { examples } from './examples'
import source from './helpers.ts?raw'

export default function DataTypes() {
  return <ExampleTable examples={examples} source={source} />
}
