import { Formik } from 'formik'
import React, { Component } from 'react';
import { Text, Button, Alert, View } from 'react-native';
import { styles, validationSchema } from './utils';
import { Gene } from './Gene';
import { InitFormField } from './InitFormField';

// https://www.youtube.com/watch?v=SfEZSyvbj2w - пример 
// https://habr.com/ru/post/128704/ - точный приме с уравнением

export default class App extends Component {
  state = {
    x: [],
  }

  onSubmitHandler = ({ a, b, c, d, y, delta, iterCount }) => {
    const coefs = [a, b, c, d];
    const populationSize = 5;

    const gene = new Gene(populationSize, y, coefs);
    const { message, x } = gene.findPopulation(iterCount, delta);

    Alert.alert('Message', message);
    console.log(message, x);
    this.setState({ x });
  };

  render() {
    return (
      <Formik
        initialValues={{ a: 1, b: 1, c: 1, d: 1, y: 30, delta: 0.05, iterCount: 1000 }}
        onSubmit={this.onSubmitHandler}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
          <View style={styles.cnt}>
            <Text style={styles.textTitle}>Генетичний алгоритм</Text>
            {
              ['a', 'b', 'c', 'd', 'y', 'delta', 'iterCount'].map(parameterName => (
                InitFormField({ parameterName, values, handleChange, errors, setFieldTouched, touched })
              ))
            }
            {
              this.state.x.map((item, index) => (
                <Text
                  key={index+1}
                  style={styles.textTitle}
                >
                  {`x${index+1}: ${item}`}
                </Text>
              ))
            }
            <Button
              title='Go!'
              disabled={!isValid}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    );
  }
}
