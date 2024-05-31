/**
 * Copyright (c) 2020-present, Goldman Sachs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TablePagination, type TablePaginationProps } from '@mui/material';
import clsx from 'clsx';

export const BaseTablePagination: React.FC<
  {
    className?: string | undefined;
    rows: unknown[];
    rowsPerPage: number;
    page: number;
    rowsPerPageOptions: (number | { label: string; value: number })[];
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => void;
    onRowsPerPageChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
  } & TablePaginationProps
> = (props) => {
  const {
    className,
    rows,
    rowsPerPage,
    page,
    rowsPerPageOptions,
    onRowsPerPageChange,
    onPageChange,
    ...otherProps
  } = props;
  return (
    <div className={clsx('mui-table-pagination', className)}>
      <TablePagination
        {...otherProps}
        className={className}
        component="div"
        page={page}
        count={rows.length}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
};
