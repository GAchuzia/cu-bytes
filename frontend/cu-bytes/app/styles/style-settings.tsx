import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 180, 180, 1)',
    paddingTop: '0.5%' as any,
    paddingHorizontal: '0.5%' as any,
    alignItems: 'center',
    overflowY: 'scroll'
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: '280%' as any,
    fontWeight: '800',

    textAlign: 'center',
    margin: '0.5%' as any,

    color: 'red',
    backgroundColor: '#FFFFFFFF',
    padding: '1.8%' as any,
    borderRadius: 40
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',

    margin: '1.2%' as any,
    elevation: 8,

    backgroundColor: '#007AFF',
    padding: '0.5%' as any,

    borderRadius: 30,
    borderWidth: 3,
    borderBlockColor: '#000000FF',

    shadowColor: '#000000FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    width: '50%'
  },
  buttonDisabled: {
    backgroundColor: '#cccccccc',
  },
  buttonText: {
    fontFamily: 'sans-serif',
    fontSize: '200%' as any,
    fontWeight: '800',

    color: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '1%' as any,
    width: '85%',
  },
  label: {
    flex: 1,
    fontSize: '150%' as any,
    paddingRight: '1%' as any,
    flexWrap: 'wrap',
  },
  switchContainer: {
    width: '15%',
    alignItems: 'flex-end'
  },
  switch: {
    transform: [{ scale: 1.4 }],
  },
});
