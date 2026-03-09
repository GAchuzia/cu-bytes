import { StyleSheet } from 'react-native';
import { w, h, font } from './dimensions';

export const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlign: 'center',
    width: w(100),
  },

  scrollContent: {
    alignItems: 'center',
    paddingBottom: h(6),
    width: w(100),
  },

  scrollView: {
    alignSelf: 'stretch',
    flex: 1,
  },

  headerContainer: {
    backgroundColor: '#C5151A',
    width: w(10),
  },

  bodyContainer: {
    backgroundColor: '#FFFFFF',
    width: w(100),
  },

  statusbar: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: h(1),
    paddingHorizontal: w(2),
    textAlign: 'center',
    width: w(100),
  },

  headerButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: h(1.2),
    paddingHorizontal: w(3),
    minWidth: w(18),
    maxHeight: h(6),
  },

  headerButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '600',
    textAlign: 'center',
  },

  headerTitle: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(280),
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    flex: 1,
  },

  headerUsernameIcon: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(110),
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: w(1),
    maxWidth: w(15),
  },

  infoText: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '500',
    marginTop: h(0.5),
    paddingTop: h(5),
    paddingBottom: h(5),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(100),
  },

  bodyButton: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#131312',
    marginTop: h(2.5),
    marginBottom: h(2.5),
    padding: h(2.5),
    width: w(80),
  },

  bodyButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: '600',
    textAlign: 'center',
  },

  row: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingLeft: w(5),
    paddingRight: w(5),
    paddingVertical: h(1),
    width: w(85),
  },

  label: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: font(150),
    paddingRight: w(1),
  },

  switchContainer: {
    alignItems: 'flex-end',
    width: w(15),
  },

  switch: {
    transform: [{ scale: 1.4 }],
  },

});
