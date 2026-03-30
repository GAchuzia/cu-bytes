import { Text, View, type TextStyle, type ViewStyle } from 'react-native';

export type KeyValueRowItem = {
  field_name: string;
  field_value: string;
};

type RowStyles = {
  row: ViewStyle;
  rowLast: ViewStyle;
  rowCellLabel: TextStyle;
  rowCellValue: TextStyle;
};

type Props = {
  rows: KeyValueRowItem[];
  styles: RowStyles;
};

/**
 * Renders key/value rows inside a parent ScrollView.
 */
export function KeyValueRows({ rows, styles: s }: Props) {
  return (
    <>
      {rows.map((item, index) => (
        <View
          key={`${item.field_name}-${index}`}
          style={[s.row, index === rows.length - 1 && s.rowLast]}
        >
          <Text style={s.rowCellLabel}>{item.field_name}</Text>
          <Text style={s.rowCellValue}>{item.field_value}</Text>
        </View>
      ))}
    </>
  );
}
