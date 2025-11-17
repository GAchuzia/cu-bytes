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
  subtitle: {
    fontFamily: 'sans-serif',
    fontSize: '150%' as any,
    fontWeight: '600',

    textAlign: 'center',
    margin: '0.5%' as any,

    color: '#000000FF',
    backgroundColor: 'rgba(255, 210, 210, 1)',
    padding: '1.2%' as any,
    borderRadius: 40
  },
  subsubtitle: {
    fontFamily: 'sans-serif',
    fontSize: '150%' as any,
    fontWeight: '400',

    textAlign: 'center',
    textDecorationLine: 'underline',

    color: '#000000FF',
    backgroundColor: 'rgba(255, 210, 210, 1)',
    padding: '0.8%' as any,
    borderRadius: 0,

    width: '30%'
  },
  description: {
    fontFamily: 'sans-serif',
    fontSize: '125%' as any,
    fontWeight: '400',

    textAlign: 'center',
    marginBottom: '0.5%' as any,

    color: '#000000FF',
    backgroundColor: 'rgba(255, 210, 210, 1)',
    padding: '0.8%' as any,
    borderRadius: 0,

    width: '30%'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: '1.5%' as any,
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
  pressableText: {
    alignItems: 'center',

    marginTop: '0%' as any,

    fontFamily: 'sans-serif',
    fontSize: '150%' as any,
    fontWeight: 600,

    color: '#000000FF',
    backgroundColor: 'rgba(230, 250, 250, 1)',
    padding: '1.6%' as any,
    paddingHorizontal: '2.4%' as any,
    borderRadius: 0
  },
  infoSection: {
    backgroundColor: 'white',
    padding: '1.2%' as any,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: '100%' as any,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1%' as any,
  },
  infoText: {
    fontSize: '100%' as any,
    color: '#666',
    marginBottom: '1%' as any,
  },
  textInput: {
    fontSize: '150%' as any,
    fontFamily: 'Sans-Serif',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: '1%' as any,
    elevation: 8,

    backgroundColor: '#FFFFFF',
    paddingVertical: '1%' as any,
    paddingHorizontal: '1%' as any,

    borderRadius: 10,
    borderWidth: 2,
    borderBottomColor: '#000000FF',

    shadowColor: '#000000FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    
    width: '60%'
  }
});